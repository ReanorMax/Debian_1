document.addEventListener('DOMContentLoaded', () => {
  // Tab switching functionality
  const sections = {
    disks: document.getElementById('disks'),
    encryption: document.getElementById('encryption'),
    installation: document.getElementById('installation'),
    system: document.getElementById('system'),
    check: document.getElementById('check'),
    instructions: document.getElementById('instructions'),
    bios: document.getElementById('bios')
  };

  function switchSection(sectionId) {
    Object.values(sections).forEach(section => {
      section.style.display = 'none';
      section.classList.remove('active-section');
    });
    
    if (sections[sectionId]) {
      // Reset opacity and transform for cards before showing section
      if(sectionId === 'installation') {
        document.querySelectorAll('#installation .raid-card').forEach(card => {
          card.style.opacity = '0';
          card.style.transform = 'translateY(20px)';
        });
      }
      
      // Reset encryption cards when switching to encryption section
      if(sectionId === 'encryption') {
        document.querySelectorAll('#encryption .raid-card').forEach((card, index) => {
          card.style.opacity = '0';
          card.style.transform = 'translateY(20px)';
          // Remove and reapply transition to reset animation
          card.style.transition = 'none';
          card.offsetHeight; // Force reflow
          card.style.transition = `opacity 0.8s ease-in-out, transform 0.8s ease-in-out`;
          card.style.transitionDelay = `${index * 0.2}s`;
        });
      }
      
      sections[sectionId].style.display = 'block';
      sections[sectionId].classList.add('active-section');
      sections[sectionId].scrollIntoView({ behavior: 'smooth' });
      
      // Re-observe cards when switching sections
      if(sectionId === 'installation') {
        observer.disconnect();
        document.querySelectorAll('#installation .raid-card').forEach(card => {
          observer.observe(card);
        });
      }
      
      if(sectionId === 'encryption') {
        encryptionObserver.disconnect();
        document.querySelectorAll('#encryption .raid-card').forEach(card => {
          encryptionObserver.observe(card);
        });
      }
    }
  }

  // Navigation handling with section switching
  const navLinks = document.querySelectorAll('.nav-links li');
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navLinks.forEach(l => l.classList.remove('active'));
      link.classList.add('active');
      const sectionId = link.getAttribute('data-section');
      switchSection(sectionId);
    });
  });

  // Initialize first section
  switchSection('disks');

  // Smooth scroll for better UX
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      document.querySelector(this.getAttribute('href')).scrollIntoView({
        behavior: 'smooth'
      });
    });
  });

  // Add hover animation for disk cards
  const diskCards = document.querySelectorAll('.disk-card');
  
  diskCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      card.style.transform = 'translateY(-10px)';
    });
    
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'translateY(0)';
    });
  });

  // Add animation for RAID10 disk icons
  const diskIcons = document.querySelectorAll('.disk-icon');
  
  diskIcons.forEach((icon, index) => {
    icon.style.animationDelay = `${index * 0.2}s`;
  });

  // Update Intersection Observer for fade-in animations
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px'
  });

  // Observe installation cards with fade effect
  document.querySelectorAll('#installation .raid-card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'opacity 0.5s ease-in-out, transform 0.5s ease-in-out';
    observer.observe(card);
  });

  // Observe all sections for general animations
  document.querySelectorAll('section').forEach(section => {
    observer.observe(section);
  });

  // Update encryption observer to handle multiple transitions
  const encryptionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        requestAnimationFrame(() => {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        });
      } else {
        // Reset when element leaves viewport
        entry.target.style.opacity = '0';
        entry.target.style.transform = 'translateY(20px)';
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px'
  });

  // Setup initial state and observe encryption cards
  document.querySelectorAll('#encryption .raid-card').forEach((card, index) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'opacity 0.8s ease-in-out, transform 0.8s ease-in-out';
    card.style.transitionDelay = `${index * 0.2}s`;
    encryptionObserver.observe(card);
  });

  // Add check cards observer
  const checkObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      } else {
        entry.target.classList.remove('visible');
      }
    });
  }, {
    threshold: 0.1
  });

  // Observe check cards
  document.querySelectorAll('.check-card').forEach(card => {
    checkObserver.observe(card);
  });

  // Checks tabs functionality
  const checkTabs = document.querySelectorAll('.check-tab');
  const checkContents = document.querySelectorAll('.check-content-container');

  function switchCheckTab(tabId) {
    checkTabs.forEach(tab => tab.classList.remove('active'));
    checkContents.forEach(content => content.classList.remove('active'));
  
    const activeTab = document.querySelector(`[data-check-tab="${tabId}"]`);
    const activeContent = document.querySelector(`[data-check-content="${tabId}"]`);
  
    activeTab.classList.add('active');
    activeContent.classList.add('active');
  }

  checkTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const tabId = tab.getAttribute('data-check-tab');
      switchCheckTab(tabId);
    });
  });

  // Accordion functionality
  const accordionHeaders = document.querySelectorAll('.check-accordion-header');

  accordionHeaders.forEach(header => {
    header.addEventListener('click', () => {
      const accordion = header.parentElement;
      const content = accordion.querySelector('.check-accordion-content');
      const isActive = header.classList.contains('active');
    
      // Close all accordions
      accordionHeaders.forEach(h => {
        h.classList.remove('active');
        h.parentElement.querySelector('.check-accordion-content').classList.remove('active');
      });
    
      // If the clicked accordion wasn't active, open it
      if (!isActive) {
        header.classList.add('active');
        content.classList.add('active');
      }
    });
  });

  // Initialize first tab and accordion
  switchCheckTab('system');

  const terminalBlocks = document.querySelectorAll('.terminal-output, .terminal-command');
  
  terminalBlocks.forEach(block => {
    // Create copy button
    const copyBtn = document.createElement('button');
    copyBtn.className = 'copy-btn';
    copyBtn.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 24 24">
        <path fill="currentColor" d="M19,21H8V7H19M19,5H8A2,2 0 0,0 6,7V21A2,2 0 0,0 8,23H19A2,2 0 0,0 21,21V7A2,2 0 0,0 19,5M16,1H4A2,2 0 0,0 2,3V17H4V3H16V1Z"/>
      </svg>
      <span>Копировать</span>
    `;
    
    block.parentNode.style.position = 'relative';
    block.parentNode.appendChild(copyBtn);
    
    copyBtn.addEventListener('click', async () => {
      // Find command text within terminal block
      const commandText = block.textContent.trim();
      
      try {
        await navigator.clipboard.writeText(commandText);
        
        // Visual feedback
        copyBtn.innerHTML = `
          <svg width="16" height="16" viewBox="0 0 24 24">
            <path fill="currentColor" d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z"/>
          </svg>
          <span>Скопировано!</span>
        `;
        copyBtn.classList.add('copied');
        
        // Reset button after delay
        setTimeout(() => {
          copyBtn.innerHTML = `
            <svg width="16" height="16" viewBox="0 0 24 24">
              <path fill="currentColor" d="M19,21H8V7H19M19,5H8A2,2 0 0,0 6,7V21A2,2 0 0,0 8,23H19A2,2 0 0,0 21,21V7A2,2 0 0,0 19,5M16,1H4A2,2 0 0,0 2,3V17H4V3H16V1Z"/>
            </svg>
            <span>Копировать</span>
          `;
          copyBtn.classList.remove('copied');
        }, 2000);
        
      } catch (err) {
        console.error('Failed to copy:', err);
      }
    });
  });

  // Add instruction tab functionality
  const instructionTabs = document.querySelectorAll('.instruction-tab');
  const instructionPanels = document.querySelectorAll('.instruction-tab-panel');

  instructionTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      // Remove active class from all tabs and panels
      instructionTabs.forEach(t => t.classList.remove('active'));
      instructionPanels.forEach(p => p.classList.remove('active'));

      // Add active class to clicked tab and corresponding panel
      tab.classList.add('active');
      const panel = document.querySelector(`.instruction-tab-panel[data-panel="${tab.dataset.tab}"]`);
      if (panel) {
        panel.classList.add('active');
      }
    });
  });
});